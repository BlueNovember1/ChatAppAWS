import { CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_09dfwiPzH",
    ClientId: "54ddjbgk72792farqvfb5e9fn7",
}
export default new CognitoUserPool(poolData);