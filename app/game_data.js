const SERVER_PATH = "http://localhost:4000";

const CONFIG = {
    dayLength: 600,
    taskGenerateInterval: 10,
    taskGenerateCooldown: 60,
    eventGenerateInterval: 30,
    eventGenerateCooldown: 300,
    scenarioInterval: 12,
    maxLevel: 4
}

const SLIDE_IN_DURATION = 600;
const MESSAGE_TIMEOUT = 10000;
const LEVEL_UP_DURATION = 1000;

const MAP = {
    locations: [
        {
            id: "equipment_manufacturers",
            name: "",
            x: 600,
            y: 100,
            width: 128,
            minLevel: 3
        },
        {
            id: "government",
            name: "",
            x: 1200,
            y: 400,
            width: 128,
            minLevel: 3
        },
        {
            id: "health_insurance",
            name: "",
            x: 200,
            y: 200,
            width: 128,
            minLevel: 2
        },
        {
            id: "hospital",
            name: "Westside Hospital",
            x: 500,
            y: 300,
            width: 128,
            minLevel: 1
        },
        {
            id: "pharmaceutical_company",
            name: "",
            x: 1000,
            y: 200,
            width: 128,
            minLevel: 2
        },
        {
            id: "pharmacy",
            name: "",
            x: 800,
            y: 400,
            width: 128,
            minLevel: 1
        },
        {
            id: "police_station",
            name: "",
            x: 300,
            y: 700,
            width: 128,
            minLevel: 2
        },
        {
            id: "school",
            name: "",
            x: 1400,
            y: 700,
            width: 128,
            minLevel: 4
        },
        {
            id: "store",
            name: "",
            x: 900,
            y: 700,
            width: 128,
            minLevel: 1
        },
        {
            id: "urgent_care",
            name: "",
            x: 600,
            y: 600,
            width: 128,
            minLevel: 1
        },
        {
            id: "who",
            name: "World Health Organization",
            x: 1500,
            y: 200,
            width: 128,
            minLevel: 4
        }
    ],
    roads: [

    ]
}

const PROGRESSION = [
    {},
    {
        xp: 40
    },
    {
        xp: 100
    },
    {
        xp: 250
    },
    {
        xp: 600
    }
]

const RANDOM_TASKS = [
    {
        id: 0,
        locationID: "pharmacy",
        probability: 0.4,
        duration: [0, CONFIG.dayLength],
        xp: 20,
        content: {
            type: "text",
            text: "Medications prescribed by a care provider can be picked up at a pharmacy."
        }
    },
    {
        id: 1,
        locationID: "store",
        probability: 0.5,
        duration: [0, CONFIG.dayLength],
        xp: 20,
        content: {
            type: "text",
            text: "Most grocery stores and general stores carry over the counter (OTC) medication. This type of medication has been deemed safe for use by the general public and does not require a prescription."
        }

    }
]

const SCHEDULED_TASKS = [

]

const EVENTS = [
    {
        id: "car_crash",
        probability: 0.5,
        message: "A car accident has been reported! First responders have been dispatched to the scene.",
        tasks: [
            {
                locationID: "hospital",
                duration: [0, CONFIG.dayLength],
                xp: 30,
                content: {
                    type: "text",
                    text: "An unconscious patient is rushed into the emergency room by paramedics. They are deemed to have suffered life-threatening injuries and have been prioritized for treatemnt through the triage system."
                }
            }
        ]
    },
    // {
    //     id: "sports_injury",
    //     probability: 0.3,
    //     message: "",
    //     tasks: [
    //         {
    //             locationID: "urgent_care",
    //             duration: [0, CONFIG.dayLength],
    //             xp: 20,
    //             content: {}
    //         }
    //     ]
    // },
    // {
    //     id: "shooting",
    //     probability: 0.05,
    //     message: "",
    //     tasks: [
    //         {
    //             locationID: "hospital",
    //             duration: [0, CONFIG.dayLength],
    //             xp: 20,
    //             content: {}
    //         }
    //     ]
    // }
]

const SCENARIOS = [
    {
        id: "pandemic",
        startDay: 30,
        endDay: 40,
        message: "A pandemic has been declared!",
        tasks: [

        ]
    }
]