const offset = 14

const all_panels = [{
    address: 0b100,
    offset: {
        x: 0,
        y: 0
    },
    bounds: {
        x: 0,
        y: 0,
        width: 28,
        height: 7
    }
},
{
    address: 0b101,
    offset: {
        x: 0,
        y: 0
    },
    bounds: {
        x: 0,
        y: 7,
        width: 28,
        height: 7
    }
},
{
    address: 0b01,
    offset: {
        x: offset,
        y: 0
    },
    bounds: {
        x: 0,
        y: 14,
        width: 28,
        height: 7
    }
},
{
    address: 0b11,
    offset: {
        x: offset,
        y: 0
    },
    bounds: {
        x: 0,
        y: 21,
        width: 28,
        height: 7
    }
},
{
    address: 0b1000,
    offset: {
        x: 0,
        y: 0
    },
    bounds: {
        x: 28,
        y: 0,
        width: 28,
        height: 7
    }
},
{
    address: 0b111,
    offset: {
        x: 0,
        y: 0
    },
    bounds: {
        x: 28,
        y: 7,
        width: 28,
        height: 7
    }
},
{
    address: 0b1011,
    offset: {
        x: offset,
        y: 0
    },
    bounds: {
        x: 28,
        y: 14,
        width: 28,
        height: 7
    }
},
{
    address: 0b1001,
    offset: {
        x: offset,
        y: 0
    },
    bounds: {
        x: 28,
        y: 21,
        width: 28,
        height: 7
    }
}]

const config = {
    socket: {
        url: 'localhost',
        port: 4000
    },
    panels: [...all_panels.slice(0, 2)]
    //panels: all_panels
}



module.exports = config
