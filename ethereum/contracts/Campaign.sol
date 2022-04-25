// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution, string memory campaignDescription) public {
        // msg.sender needs to be passed down, otherwise the manager of Campaign will
        // be this factory contract
        Campaign NewCampaign = new Campaign(minimumContribution, msg.sender, campaignDescription);
        deployedCampaigns.push(address(NewCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign {
    // This is a type definition in opposed to the ones below
    struct Request {
        string description;
        uint amount;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    string public campaignDescription;
    uint public minimumContribution;
    mapping(address => bool) public contributors;
    uint public contributorCount;

    uint public numRequests;
    mapping (uint => Request) public requests;
    // Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // Called once when the contract is instantiated
    constructor(uint minimum, address creator, string memory description) {
        // we have access to the global msg object in EVERY function
        manager = creator;
        minimumContribution = minimum;
        campaignDescription = description;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Must contribute more than the minimum amount!");

        contributors[msg.sender] = true;
        contributorCount++;
    }

    function createRequest(string memory description, uint amount, address recipient)
    public restricted {
        // we need to create a new instance of a struct (right side of eq.)
        // Request memory newRequest = Request({
        //     description: description,
        //     amount: amount,
        //     recipient: recipient,
        //     complete: false,
        //     approvalCount: 0
        // });

        // requests.push(newRequest);

        Request storage newRequest = requests[numRequests++];
        newRequest.description = description;
        newRequest.amount = amount;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(contributors[msg.sender], "Must be a contributor to approve requests!");
        require(!request.approvals[msg.sender], "Must have not approved the request already!");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete, "Request can't be completed!");
        require(request.approvalCount > (contributorCount / 2), "Request should be approved by more than 50% of contributors!");
        require(request.amount < address(this).balance, "Contract balance needs to be higher than the required amount!");

        payable(request.recipient).transfer(request.amount);
        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address, string memory) {
        return (
        minimumContribution,
        address(this).balance,
        numRequests,
        contributorCount,
        manager,
        campaignDescription
        );
    }
}
