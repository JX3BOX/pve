// 批量构建方案相关接口
import { $cms, $next } from "@jx3box/jx3box-common/js/https";

export const getRecipeList = () => {
    return $cms().get("/api/cms/dbm/build/recipe");
};

export const createRecipe = (data) => {
    return $cms().post("/api/cms/dbm/build/recipe", data);
};

export const updateRecipe = (id, data) => {
    return $cms().put(`/api/cms/dbm/build/recipe/${id}`, data);
};

export const deleteRecipe = (id) => {
    return $cms().delete(`/api/cms/dbm/build/recipe/${id}`);
};
