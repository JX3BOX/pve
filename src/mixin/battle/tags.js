import { getRank } from "@/service/battle/team";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";

export default {
    data() {
        return {
            ranks: []
        }
    },
    computed: {
        current() {
            return this.$store.state.current;
        },
        tags: function ({ current, ranks }) {
            const _tags = [];

            // 如果存在rank id
            if (current?.rank_id) {
                const rank = ranks.find((item) => item.ID == current.rank_id);
                rank && _tags.push({
                    name: rank.name,
                    id: rank.ID,
                    type: "rank",
                });
            }
            // 如果存在boss id
            if (current?.boss_id) {
                const rank = ranks.find((item) => item.ID == current.rank_id);
                const bossMap = rank?.boss_map;
                const boss = bossMap?.find((item) => item.achievement_id == current.boss_id);
                boss && _tags.push({
                    name: boss.name,
                    id: boss.achievement_id, // 对应成就id
                    type: "boss",
                    rank_id: current.rank_id,
                });
            }
            // 如果存在心法id
            if (current?.mount_id) {
                _tags.push({
                    name: xfid[current.mount_id],
                    id: current.mount_id,
                    type: "mount",
                    boss_id: current.boss_id,
                    rank_id: current.rank_id,
                });
            }

            return _tags;
        },
    },
    mounted() {
        this.getRanks();
    },
    methods: {
        getRanks() {
            try {
                const jbRanks = sessionStorage.getItem("jbRanks");
                if (jbRanks) {
                    this.ranks = JSON.parse(jbRanks);
                    return;
                } else {
                    const params = {
                        pageIndex: 1,
                        pageSize: 100,
                    };
                    getRank(params).then((res) => {
                        sessionStorage.setItem("jbRanks", JSON.stringify(res.data.data.list || []));
                        this.ranks = res.data.data.list || [];
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        tagLink({ id, type, rank_id, boss_id }) {
            if (type === "rank") return `/rank/race/#/${id}/dps`;
            if (type === "boss") return `/rank/race/#/${rank_id}/dps?aid=${id}`;
            if (type === "mount") return `/rank/race/#/${rank_id}/dps?aid=${boss_id}&mount=${id}`;
        },
    }
}
