const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to categorize commit message
function categorizeCommit(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.startsWith('feat:') || lowerMessage.includes('add ') || lowerMessage.includes('implement ')) {
    return 'New Feature';
  } else if (lowerMessage.startsWith('fix:') || lowerMessage.includes('fix ') || lowerMessage.includes('bug')) {
    return 'Bug Fix';
  } else if (lowerMessage.startsWith('update') || lowerMessage.includes('improve') || lowerMessage.includes('enhance') || lowerMessage.startsWith('refactor:')) {
    return 'Improvement';
  } else {
    return 'Improvement'; // Default
  }
}

// Function to convert commit message to user-friendly description
function formatDescription(message) {
  // Remove common prefixes
  let description = message
    .replace(/^feat:\s*/i, '')
    .replace(/^fix:\s*/i, '')
    .replace(/^refactor:\s*/i, '')
    .replace(/^update\s*/i, '')
    .replace(/^add\s+/i, 'Added ')
    .replace(/^implement\s+/i, 'Implemented ')
    .replace(/^enhance\s+/i, 'Enhanced ')
    .replace(/^improve\s+/i, 'Improved ')
    .trim();
  
  // Capitalize first letter
  if (description.length > 0) {
    description = description.charAt(0).toUpperCase() + description.slice(1);
  }
  
  // Make it more user-friendly - convert technical terms to simpler language
  // Use word boundaries to avoid replacing parts of words
  description = description
    .replace(/\bUI\b/gi, 'user interface')
    .replace(/\bUX\b/gi, 'user experience')
    .replace(/\bAPI\b/gi, 'system integration')
    .replace(/\bbug\b/gi, 'issue')
    .replace(/\bfix\b/gi, 'resolved')
    .replace(/\bmodal\b/gi, 'popup window')
    .replace(/\bcomponent\b/gi, 'feature')
    .replace(/\bendpoint\b/gi, 'connection');
  
  // Add period if missing
  if (description.length > 0 && !description.endsWith('.') && !description.endsWith('!') && !description.endsWith('?')) {
    description += '.';
  }
  
  return description;
}

// Function to get user-friendly title from commit message
function formatTitle(message) {
  let title = message
    .replace(/^feat:\s*/i, '')
    .replace(/^fix:\s*/i, '')
    .replace(/^refactor:\s*/i, '')
    .replace(/^update\s*/i, '')
    .trim();
  
  // Take first part before colon or first 50 characters
  if (title.includes(':')) {
    title = title.split(':')[0].trim();
  }
  
  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  
  // Limit length
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  return title;
}

try {
  // Get git log with commit hash, date, and message
  const gitLog = execSync('git log --pretty=format:"%h|%ad|%s" --date=short -100', { encoding: 'utf-8' });
  
  const lines = gitLog.trim().split('\n');
  const changelogEntries = [];
  const seenDates = new Set();
  
  // Group commits by date
  const commitsByDate = {};
  
  lines.forEach(line => {
    if (!line.trim()) return;
    
    const [hash, date, ...messageParts] = line.split('|');
    const message = messageParts.join('|').trim();
    
    // Skip merge commits and empty messages
    if (message.toLowerCase().startsWith('merge') || 
        message.toLowerCase().includes('merge pull request') ||
        message.toLowerCase().includes('merge branch') ||
        !message) {
      return;
    }
    
    if (!commitsByDate[date]) {
      commitsByDate[date] = [];
    }
    
    commitsByDate[date].push({
      hash: hash.trim(),
      message: message,
      date: date.trim()
    });
  });
  
  // Process commits and create changelog entries
  // Group similar commits on the same day
  Object.keys(commitsByDate).sort().reverse().forEach(date => {
    const commits = commitsByDate[date];
    
    // Group commits by type
    const groupedCommits = {
      'New Feature': [],
      'Improvement': [],
      'Bug Fix': []
    };
    
    commits.forEach(commit => {
      const type = categorizeCommit(commit.message);
      groupedCommits[type].push(commit);
    });
    
    // Create entries for each type that has commits
    Object.keys(groupedCommits).forEach(type => {
      const typeCommits = groupedCommits[type];
      if (typeCommits.length > 0) {
        // If multiple commits of same type on same day, combine them
        if (typeCommits.length === 1) {
          const commit = typeCommits[0];
          changelogEntries.push({
            date: commit.date,
            type: type,
            title: formatTitle(commit.message),
            description: formatDescription(commit.message)
          });
        } else {
          // Combine multiple commits
          const titles = typeCommits.map(c => formatTitle(c.message));
          const descriptions = typeCommits.map(c => formatDescription(c.message));
          
          changelogEntries.push({
            date: date,
            type: type,
            title: titles[0] + (titles.length > 1 ? ` and ${titles.length - 1} more` : ''),
            description: descriptions.join(' ')
          });
        }
      }
    });
  });
  
  // Sort by date (newest first)
  changelogEntries.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Limit to 30 most recent entries
  const limitedEntries = changelogEntries.slice(0, 30);
  
  // Write to JSON file
  const outputPath = path.join(__dirname, '..', 'lib', 'changelog.json');
  fs.writeFileSync(outputPath, JSON.stringify(limitedEntries, null, 2), 'utf-8');
  
  console.log(`✅ Generated changelog with ${limitedEntries.length} entries`);
  console.log(`📄 Saved to: ${outputPath}`);
  
} catch (error) {
  console.error('Error generating changelog:', error.message);
  process.exit(1);
}

