const CONFIG = {
    dayLength: 600,
    tasksInterval: 100,
    eventInterval: 300,
    scenarioInterval: 12,
    maxLevel: 4
}

const SLIDE_IN_DURATION = 600;
const MESSAGE_TIMEOUT = 10000;
const LEVEL_UP_DURATION = 1000;

const EVENTS = [
    {
        id: "car_crash",
        description: "",
        tasks: [
            {
                buildingID: "hospital",
                description: "",
                xp: 30,
                content: {}
            }
        ]
    },
    {
        id: "sports_injury",
        description: "",
        tasks: [
            {
                buildingID: "urgent_care",
                description: "",
                xp: 20,
                content: {}
            }
        ]
    },
    {
        id: "shooting",
        description: "",
        tasks: [
            {
                buildingID: "hospital",
                description: "",
                xp: 20,
                content: {}
            }
        ]
    }
]

const MAP = {
    locations: [
        {
            id: "equipment_manufacturers",
            name: "",
            x: 600,
            y: 100,
            width: 128,
        },
        {
            id: "government",
            name: "",
            x: 1200,
            y: 400,
            width: 128,
        },
        {
            id: "health_insurance",
            name: "",
            x: 200,
            y: 200,
            width: 128,
        },
        {
            id: "hospital",
            name: "Westside Hospital",
            x: 500,
            y: 300,
            width: 128
        },
        {
            id: "pharmaceutical_company",
            name: "",
            x: 1000,
            y: 200,
            width: 128
        },
        {
            id: "pharmacy",
            name: "",
            x: 800,
            y: 400,
            width: 128
        },
        {
            id: "police_station",
            name: "",
            x: 300,
            y: 700,
            width: 128
        },
        {
            id: "school",
            name: "",
            x: 1400,
            y: 700,
            width: 128
        },
        {
            id: "store",
            name: "",
            x: 900,
            y: 700,
            width: 128
        },
        {
            id: "urgent_care",
            name: "",
            x: 600,
            y: 600,
            width: 128
        },
        {
            id: "who",
            name: "World Health Organization",
            x: 1500,
            y: 200,
            width: 128
        }
    ],
    roads: [

    ]
}

const PROGRESSION = [
    {},
    {
        xp: 40,
        locations: ["hospital", "store", "urgent_care", "pharmacy"]
    },
    {
        xp: 100,
        locations: ["police_station", "health_insurance", "pharmaceutical_company"]
    },
    {
        xp: 250,
        locations: ["government", "equipment_manufacturers"]
    },
    {
        xp: 600,
        locations: ["school", "who"]
    }
]

const RANDOM_TASKS = [
    {
        id: 0,
        buildingID: "hospital",
        probability: 0.1,
        description: "",
        xp: 10,
        content: {}
    }
]

const SCHEDULED_TASKS = [

]

const SCENARIOS = [
    {
        id: "pandemic",
        day: 30,
        description: "A pandemic has been declared!",
        tasks: [
            {
                building_id: "hospital",
                description: "",
                xp: 0,
                content: {}
            }
        ]
    }
]