import FieldType from '@/constants/FieldType';

const channels = {
    Hierarchy: {
        name: 'Hierarchy',
        type: [FieldType.QUANTITATIVE],
        isEncoding: false,
    },
    size: {
        name: 'size',
        type:[FieldType.QUANTITATIVE],
        aggregation: 'sum',
        isEncoding: false,
    },
    color: {
        name: 'color',
        type:[FieldType.NOMINAL, FieldType.ORDINAL],//, FieldType.QUANTITATIVE
        isEncoding: false,
    },

    // y: {
    //     name: 'y',
    //     type: [FieldType.QUANTITATIVE],
    // },
    
    
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