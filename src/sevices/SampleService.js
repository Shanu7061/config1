// import { Auth } from "aws-amplify";
import axios from "axios";

const BI_API_BASE_URL = process.env.MAIN_API;

class SampleService {
  async getReq(clientName) {
    let myInit = {
      params: {
        query: clientName,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
    };

    return await axios.get(
      BI_API_BASE_URL + "/accession/search/clients",
      myInit
    );
  }
}

export default new AccService();
