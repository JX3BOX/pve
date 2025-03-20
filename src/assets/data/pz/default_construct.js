import { cloneDeep } from "lodash";
const default_content ={
    id: '',
    equip: '',
    strength: 0,
    embedding: [],
    stone: "",
    enhance: "",
    enchant: "",
    skill: "",
    magic_change: {}
};

const default_construct = {
    HAT: cloneDeep(default_content),
    JACKET: cloneDeep(default_content),
    BELT: cloneDeep(default_content),
    WRIST: cloneDeep(default_content),
    BOTTOMS: cloneDeep(default_content),
    SHOES: cloneDeep(default_content),
    NECKLACE: cloneDeep(default_content),
    PENDANT: cloneDeep(default_content),
    RING_1: cloneDeep(default_content),
    RING_2: cloneDeep(default_content),
    PRIMARY_WEAPON: cloneDeep(default_content),
    TERTIARY_WEAPON: cloneDeep(default_content),
    SECONDARY_WEAPON: cloneDeep(default_content),
};

export default default_construct;
