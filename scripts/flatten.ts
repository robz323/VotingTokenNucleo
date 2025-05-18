import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  try {
    // Crear directorio flattened si no existe
    const flattenedDir = path.join(__dirname, '../flattened')
    if (!fs.existsSync(flattenedDir)) {
      fs.mkdirSync(flattenedDir)
    }

    // Ejecutar hardhat flatten
    const output = execSync(
      'npx hardhat flatten contracts/VotingToken.sol',
      { encoding: 'utf-8' }
    )

    // Guardar el resultado en un archivo
    const outputPath = path.join(flattenedDir, 'VotingTokenFlattened.sol')
    fs.writeFileSync(outputPath, output)

    console.log('✅ Contrato aplanado guardado en:', outputPath)
    console.log('📋 Copia el contenido de este archivo para verificar en Arbiscan')
  } catch (error) {
    console.error('❌ Error al aplanar el contrato:', error)
    process.exit(1)
  }
}

main() 