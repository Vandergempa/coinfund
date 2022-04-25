import Campaign from "../build/Campaign.json";
import { web3 } from "../../utils/web3";

/**
 * Creates and instance of a deployed campaign contract
 * @param contractAddress
 * @returns {Contract}
 */
const getCampaignInstance = (contractAddress) =>
  new web3.eth.Contract(Campaign.abi, contractAddress);

export default getCampaignInstance;
