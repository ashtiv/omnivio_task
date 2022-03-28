export const initialState = {
    axiosurl: "http://localhost:5000",
    omniurl: "http://www.omdbapi.com/?t=",
    apikey: "&apikey=fa857402",
    editid: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ID":
            return {
                ...state,
                editid: action.id
            };
            break;
        default:
            return state;
    }
};

export default reducer;