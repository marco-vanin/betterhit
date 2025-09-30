const fs = require('fs');
const path = require('path');

/**
 * Script pour convertir songs.csv vers le format JSON utilisé par l'application
 */

const csvPath = path.join(__dirname, '../public/songs.csv');
const outputPath = path.join(__dirname, '../public/songs/french/summer-party.json');

// Fonction pour formater l'ID avec padding zeros (5 chiffres)
function formatSongId(cardNumber) {
  return cardNumber.toString().padStart(5, '0');
}

console.log('🎵 Conversion des songs CSV vers JSON...\n');

try {
  // Lire le fichier CSV
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const songs = {};
  let processed = 0;
  
  // Parser chaque ligne (sauf l'en-tête)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split simple sur les virgules (on fera du parsing plus tard si nécessaire)
    const parts = line.split(',');
    
    if (parts.length >= 6) {
      const cardNum = parseInt(parts[0]);
      const title = parts[1];
      const artist = parts[2];
      const url = parts[3];
      const year = parseInt(parts[6]) || null;
      
      if (cardNum && title && artist) {
        const songId = formatSongId(cardNum);
        
        songs[songId] = {
          title: title,
          artist: artist,
          year: year,
          url: url
        };
        
        processed++;
        
        if (processed <= 3) {
          console.log(`✅ ${songId}: "${title}" by ${artist} (${year})`);
        }
      }
    }
  }
  
  // Créer le dossier de destination si nécessaire
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`\n📁 Dossier créé: ${outputDir}`);
  }
  
  // Écrire le fichier JSON
  fs.writeFileSync(outputPath, JSON.stringify(songs, null, 2), 'utf8');
  
  console.log(`\n🎉 Conversion terminée !`);
  console.log(`📊 ${processed} chansons converties`);
  console.log(`📄 Fichier créé: ${outputPath}`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}