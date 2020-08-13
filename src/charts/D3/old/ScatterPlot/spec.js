const defaultSpec = {
    "encoding": {
        "x": {"field": "Income", "type": "quantitative"},
        //取消默认encoding
        "y": {},
        // "y": {"field": "Life_expectancy", "type": "quantitative"},
        "color": {"field": "Country", "type": "nordinal"},
        "id":{"field":"Country"},
        // "time":{"field":"Year"}
    },
    "style": {
        "colorset": ["rgb(141,211,199)", "rgb(255,255,179)", "rgb(190,186,218)", "rgb(251,128,114)", "rgb(219,191,140)", "rgb(130,212,230)", "rgb(146,181,204)", "rgb(242,177,173)", "rgb(255,193,104)", "rgb(127,201,127)"]
    },
    "animation": []
}

export default defaultSpec;