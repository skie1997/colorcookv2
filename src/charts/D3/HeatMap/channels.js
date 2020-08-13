import FieldType from '@/constants/FieldType';

const channels = {
    x: {
        name: 'x',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        isEncoding: false,
    },
    y: {
        name: 'y',
        type: [FieldType.QUANTITATIVE],
        aggregation: 'sum',
        isEncoding: false,
    },
    color: {
        name: 'color',
        type: [FieldType.QUANTITATIVE],
        isEncoding: false,
    },
    // time: {
    //     name: 'time',
    //     type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
    //     animation: true,
    // }
};

export default channels;