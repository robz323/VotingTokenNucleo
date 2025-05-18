import { expect } from "chai"
import { ethers } from "hardhat"
import { VotingToken } from "../typechain-types"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"

describe("VotingToken", function () {
  let votingToken: VotingToken
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addrs: SignerWithAddress[]

  beforeEach(async function () {
    // Obtener las cuentas de prueba
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners()

    // Desplegar el contrato
    const VotingToken = await ethers.getContractFactory("VotingToken")
    votingToken = await VotingToken.deploy("Voting Token", "VOTE")
  })

  describe("Despliegue", function () {
    it("Debería establecer el nombre y símbolo correctamente", async function () {
      expect(await votingToken.name()).to.equal("Voting Token")
      expect(await votingToken.symbol()).to.equal("VOTE")
    })

    it("Debería asignar el owner correctamente", async function () {
      expect(await votingToken.owner()).to.equal(owner.address)
    })
  })

  describe("Distribución de Tokens", function () {
    it("Debería distribuir tokens correctamente a los vecinos", async function () {
      const neighbors = [addr1.address, addr2.address]
      await votingToken.distributeTokens(neighbors)

      expect(await votingToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("1"))
      expect(await votingToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("1"))
    })

    it("No debería permitir distribuir tokens a una dirección que ya tiene tokens", async function () {
      await votingToken.distributeTokens([addr1.address])
      await expect(
        votingToken.distributeTokens([addr1.address])
      ).to.be.rejectedWith("Neighbor already has tokens")
    })

    it("No debería permitir distribuir tokens a una dirección cero", async function () {
      await expect(
        votingToken.distributeTokens([ethers.ZeroAddress])
      ).to.be.rejectedWith("Invalid address")
    })
  })

  describe("Propuestas", function () {
    beforeEach(async function () {
      // Distribuir tokens para poder votar
      await votingToken.distributeTokens([addr1.address, addr2.address])
    })

    it("Debería crear una propuesta correctamente", async function () {
      const tx = await votingToken.createProposal("Propuesta de prueba")
      const receipt = await tx.wait()
      
      const event = receipt?.logs[0]
      const proposalId = event?.topics[1]
      
      const proposal = await votingToken.getProposal(0)
      expect(proposal.description).to.equal("Propuesta de prueba")
      expect(proposal.isActive).to.be.true
    })

    it("Solo el owner debería poder crear propuestas", async function () {
      await expect(
        votingToken.connect(addr1).createProposal("Propuesta no autorizada")
      ).to.be.rejectedWith(/OwnableUnauthorizedAccount/)
    })

    it("Debería permitir votar en una propuesta activa", async function () {
      await votingToken.createProposal("Propuesta para votar")
      
      await votingToken.connect(addr1).vote(0, true)
      await votingToken.connect(addr2).vote(0, false)

      const proposal = await votingToken.getProposal(0)
      expect(proposal.votesFor).to.equal(1n)
      expect(proposal.votesAgainst).to.equal(1n)
    })

    it("No debería permitir votar sin tokens", async function () {
      await votingToken.createProposal("Propuesta sin votos")
      await expect(
        votingToken.connect(addrs[0]).vote(0, true)
      ).to.be.rejectedWith("No tokens to vote")
    })

    it("No debería permitir votar dos veces en la misma propuesta", async function () {
      await votingToken.createProposal("Propuesta de doble voto")
      await votingToken.connect(addr1).vote(0, true)
      
      await expect(
        votingToken.connect(addr1).vote(0, true)
      ).to.be.rejectedWith("Already voted")
    })

    it("Debería poder cerrar una propuesta", async function () {
      await votingToken.createProposal("Propuesta para cerrar")
      await votingToken.closeProposal(0)
      
      const proposal = await votingToken.getProposal(0)
      expect(proposal.isActive).to.be.false
    })

    it("No debería permitir votar en una propuesta cerrada", async function () {
      await votingToken.createProposal("Propuesta cerrada")
      await votingToken.closeProposal(0)
      
      await expect(
        votingToken.connect(addr1).vote(0, true)
      ).to.be.rejectedWith("Proposal is not active")
    })
  })
}) 