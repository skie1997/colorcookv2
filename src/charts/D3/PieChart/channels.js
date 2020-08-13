import FieldType from '@/constants/FieldType';

const channels = {
    size: {
        name: 'size',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        aggregation: 'average',
        isEncoding: false,
    },
    color: {
        name: 'color',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        isEncoding: false,
    },
    // time: {
    //     name: 'time',
    //     type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
    //     animation: true,
    // }
};

export default channels;