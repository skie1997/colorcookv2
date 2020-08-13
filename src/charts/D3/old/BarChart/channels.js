import FieldType from '@/constants/FieldType';

const channels = {
    size:{
        name:'size',
        type:[FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
        aggregation:'average',
    },
    color:{
        name:'color',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
    },

};

export default channels;