// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingToken is ERC20, Ownable {
    // Estructura para una propuesta
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool isActive;
        mapping(address => bool) hasVoted;
    }

    // Mapeo de propuestas
    mapping(uint256 => Proposal) public proposals;
    uint256 private _proposalIds;

    // Eventos
    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event TokensDistributed(address indexed to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {}

    // Función para crear una nueva propuesta
    function createProposal(string memory description) external onlyOwner returns (uint256) {
        uint256 proposalId = _proposalIds;
        _proposalIds++;

        Proposal storage newProposal = proposals[proposalId];
        newProposal.description = description;
        newProposal.votesFor = 0;
        newProposal.votesAgainst = 0;
        newProposal.isActive = true;

        emit ProposalCreated(proposalId, description);
        return proposalId;
    }

    // Función para votar en una propuesta
    function vote(uint256 proposalId, bool support) external {
        require(balanceOf(msg.sender) > 0, "No tokens to vote");
        require(proposals[proposalId].isActive, "Proposal is not active");
        require(!proposals[proposalId].hasVoted[msg.sender], "Already voted");

        Proposal storage proposal = proposals[proposalId];
        proposal.hasVoted[msg.sender] = true;

        if (support) {
            proposal.votesFor += 1;
        } else {
            proposal.votesAgainst += 1;
        }

        emit VoteCast(proposalId, msg.sender, support);
    }

    // Función para distribuir tokens a los vecinos (1 token por vecino)
    function distributeTokens(address[] calldata neighbors) external onlyOwner {
        for (uint256 i = 0; i < neighbors.length; i++) {
            require(neighbors[i] != address(0), "Invalid address");
            require(balanceOf(neighbors[i]) == 0, "Neighbor already has tokens");
            
            _mint(neighbors[i], 1 ether); // 1 token = 1 voto
            emit TokensDistributed(neighbors[i], 1 ether);
        }
    }

    // Función para obtener el estado de una propuesta
    function getProposal(uint256 proposalId) external view returns (
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        bool isActive
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.isActive
        );
    }

    // Función para verificar si una dirección ya votó
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }

    // Función para cerrar una propuesta
    function closeProposal(uint256 proposalId) external onlyOwner {
        require(proposals[proposalId].isActive, "Proposal is already closed");
        proposals[proposalId].isActive = false;
    }
} 