const defaultSpec = {
    "encoding": {
        "size":{"field":"Weight_in_lbs","type":"quantitative","aggregation":"average"},
        "color":{"field":"Origin","type":"nordinal"},
    },
    "style": {
        "layout":"unit",
        "pictogram":"circle",
    },
    "animation": []
}

export default defaultSpec;