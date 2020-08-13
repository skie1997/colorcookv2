import FieldType from '@/constants/FieldType';

const channels = {
    x: {
        name: 'x',
        // type: [FieldType.QUANTITATIVE],
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        isEncoding: false,
    },
    y: {
        name: 'y',
        type: [FieldType.QUANTITATIVE],
        isEncoding: false,
    },
    color: {
        name: 'color',
        type:[FieldType.NOMINAL, FieldType.ORDINAL],//, FieldType.QUANTITATIVE
        isEncoding: false,
    },
    size: {
        name: 'size',
        type:[FieldType.QUANTITATIVE],
        isEncoding: false,
    },
    // time: {
    //     name: 'time',
    //     type: [FieldType.TEMPORAL],
    //     animation: true,
    // },
    // id: {
    //     name: 'id',
    //     type: [FieldType.NOMINAL],
    //     animation: true,
    // }
};

export default channels;