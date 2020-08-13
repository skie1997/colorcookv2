import FieldType from '@/constants/FieldType';

const channels = {
    area: {
        name: 'area',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        isEncoding: false,
    },
    color: {
        name: 'color',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        isEncoding: false,
    },
};

export default channels;