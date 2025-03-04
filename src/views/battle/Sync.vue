<template>
    <div>
        <h1 class="u-title">保存数据</h1>
        <el-form :model="form" label-width="120px">
            <el-form-item label="是否云存档">
                <el-switch v-model="isCloud" active-color="#13ce66"></el-switch>
            </el-form-item>

            <el-form-item label="查看权限" v-if="isCloud">
                <el-radio-group v-model="form.visible" size="small">
                    <el-radio-button label="0">
                        <i class="el-icon-view"></i> 公开
                    </el-radio-button>
                    <el-radio-button label="1">
                        <i class="el-icon-lock"></i> 仅自己可见
                    </el-radio-button>
                    <el-radio-button label="2">
                        <i class="el-icon-star-off"></i> 亲友可见
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>