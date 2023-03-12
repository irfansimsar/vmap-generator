const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
fastify.register(cors);

const {adConfig} = require('./config.js');

const convertHHMMSS = sec => new Date(sec * 1000).toISOString().slice(11, 19);

const getTargetUrl = (id) => {
  const target = adConfig.targets.find(val => val.id === id);
  return target ? target.url : '';
};

const prepareAdTags = (range, ads, duration) => {
  const adTags = [];

  ads.forEach((ad) => {
    const targetUrl = getTargetUrl(ad.id);

    let adTag = {
      id: ad.id,
      type: ad.type === 'overlay' ? 'nonlinear' : 'linear',
      offset: ad.offset_time ? ad.offset_time : convertHHMMSS(Math.floor(duration / 100 * ad.offset_percent)),
      url: targetUrl,
    };

    if (ad.repeat_second) {
      const repeatedAdCount = Math.floor(duration / ad.repeat_second);
      const offsetPerAd = ad.repeat_second;
      const startOffset = ad.repeat_offset_second || 0;

      if (startOffset < offsetPerAd) {
        adTags.push({
          id: `${adTag.id}_${0}`,
          offset: convertHHMMSS( startOffset),
          type: adTag.type,
          url: adTag.url,
        });
      }

      for (let i = 1; i <= repeatedAdCount; i += 1) {
        adTags.push({
          id: `${adTag.id}_${i}`,
          offset: convertHHMMSS( startOffset + (offsetPerAd * i) ),
          type: adTag.type,
          url: adTag.url,
        });
      }
    } else if (adTag) {
      adTags.push(adTag);
    }
  });
  return adTags;
};

const getVideoAds = (duration) => {
  const adRules = adConfig.rules.find(val => val.duration_range[0] <= duration && val.duration_range[1] > duration);
  if (!adRules) return null;

  return prepareAdTags(adRules.duration_range, adRules.ads, duration);
};

const createAdBreak = (ad, userAgent) => `<vmap:AdBreak timeOffset="${ad.offset}" breakType="${ad.type}" breakId="${ad.id}"><vmap:AdSource id="${ad.id}" allowMultipleAds="false" followRedirects="true"><vmap:AdTagURI templateType="vast3"><![CDATA[${ad.url}&useragent=${userAgent}]]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak>`;

fastify.all('/vmap', async (request, reply) => {
  const {duration} = request.query;
  const userAgent = request.headers['user-agent'].replaceAll(' ', '+');

  const ads = getVideoAds(duration | 0);

  reply
    .header('Content-Type', 'text/xml,application/xml')
    .send(`<?xml version="1.0" encoding="UTF-8"?>
      <vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0">
        ${ads.map(ad => createAdBreak(ad, userAgent)).join('')}
      </vmap:VMAP>`);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3002 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
