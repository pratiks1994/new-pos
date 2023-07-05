import axiosInstance from "../Feature Components/axiosGlobal";

const updateDatabase = async () => {
      const { data } = await axiosInstance.post("/updateDatabase");
      return data
};

export default updateDatabase