exports.adConfig = {
  rules: [
    {
      duration_range: [0, 300],
      ads: [
        {
          id: "preroll_ad",
          type: "preroll",
          offset_percent: null,
          repeat_second: null,
          offset_time: "start"
        },
      ]
    },
    {
      duration_range: [300, 1000000],
      ads: [
        {
          id: "preroll_ad",
          type: "preroll",
          offset_percent: null,
          repeat_second: null,
          offset_time: "start"
        },
        {
          id: "midroll_ad",
          offset_percent: null,
          offset_time: null,
          type: "midroll",
          repeat_second: 600,
          repeat_offset_second: 300,
        }
      ]
    }
  ],
  targets: [
    {
      id: "preroll_ad",
      url: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
    },
    {
      id: "midroll_ad",
      url: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=\n"
    }
  ]
}
