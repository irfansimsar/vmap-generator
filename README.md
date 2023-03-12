# VMAP Generator
This API generates [VMAP]https://www.iab.com/guidelines/vmap/ xml file using duration and config parameters 

## Usage
```
/vmap?duration=[VIDEO_DURATION_IN_SECONDS]
```

## Getting Started

First, install dependencies
```bash
npm install
```

To develop, run the development server
```bash
npm run dev
```


Or to use it in production
```bash
npm run start
```


## Configuring
By modifying the properties in the config.js file, you can easily generate duration-based vmaps. You can see below what the properties are used for.

```typescript
declare module namespace {
    export interface Ad {
        id: string; 
        type: string; // preroll, midroll, overlay etc.
        offset_percent?: any; // calculates offset_time parameter via duration and percentage
        offset_time: string; // "start" or "HH:MM:SS" format 
		repeat_second?: number; // if it's not null, it produces ad tags as many as duration/repeat_second 
        repeat_offset_second?: number; // if it's not null, it adds one extra ad tag to first index and starts the others after this second. 
    }

    export interface Rule {
        duration_range: number[]; // [seconds, seconds]
        ads: Ad[];
    }

    export interface Target {
        id: string;
        url: string; // vast url
    }

    export interface RootObject {
        rules: Rule[];
        targets: Target[];
    }

}
```
