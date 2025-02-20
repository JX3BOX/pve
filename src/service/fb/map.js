import axios from "axios";
import { __dataPath } from '@jx3box/jx3box-common/data/jx3box'

function getMaptree() {
    return axios.get(__dataPath + 'map/data/map_tree.json')
}

export { getMaptree }
