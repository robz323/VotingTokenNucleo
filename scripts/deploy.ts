import { ethers } from "hardhat"
import * as hre from "hardhat"

async function main() {
  console.log("🚀 Iniciando despliegue del contrato VotingToken...")

  // Desplegar el contrato
  const VotingToken = await ethers.getContractFactory("VotingToken")
  const votingToken = await VotingToken.deploy("Voting Token", "VOTE")

  await votingToken.waitForDeployment()

  const address = await votingToken.getAddress()
  console.log(`✅ Contrato VotingToken desplegado en: ${address}`)
  
  // Esperar algunos bloques para la verificación
  console.log("⏳ Esperando confirmaciones para verificar el contrato...")
  await votingToken.deploymentTransaction()?.wait(5)

  // Verificar el contrato
  console.log("🔍 Verificando contrato en Arbiscan...")
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: ["Voting Token", "VOTE"],
      contract: "contracts/VotingToken.sol:VotingToken"
    })
    console.log("✅ Contrato verificado exitosamente en Arbiscan")
  } catch (error) {
    console.error("❌ Error al verificar el contrato:", error)
  }

  console.log(`🔍 Verifica el contrato en: https://sepolia.arbiscan.io/address/${address}`)
}

// Ejecutar el despliegue
main().catch((error) => {
  console.error("❌ Error durante el despliegue:", error)
  process.exitCode = 1
}) 