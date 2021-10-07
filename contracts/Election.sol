pragma solidity >=0.4.22 <0.9.0;
contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }
    uint public candidateCount;
    mapping(address=>bool) public voters;
    mapping(uint=>Candidate) public candidates;
    constructor() public{
        addCandidate("ZhaoCP");
        addCandidate("XuMX");
    }
    function addCandidate(string memory _name) private{
        candidateCount++;
        candidates[candidateCount]=Candidate(candidateCount,_name,0);
    }
    event votedEvent(uint indexed _candidateId);
    function vote(uint _candidateId) public{
        require(!voters[msg.sender]);
        require(_candidateId>0&&_candidateId<=candidateCount);
        voters[msg.sender]=true;
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }
}