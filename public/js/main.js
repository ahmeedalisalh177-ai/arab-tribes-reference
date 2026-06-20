// Load latest articles on page load
document.addEventListener('DOMContentLoaded', function() {
  loadLatestArticles();
});

// Load latest articles
async function loadLatestArticles() {
  try {
    const response = await fetch('/api/articles?limit=6');
    const data = await response.json();
    
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (data.articles.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">لا توجد مقالات حالياً</p>';
      return;
    }
    
    data.articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.innerHTML = `
        <h3>${article.title}</h3>
        <p class="excerpt">${article.excerpt || 'بدون وصف'}</p>
        <div class="meta">
          <span>بقلم: ${article.author || 'غير محدد'}</span>
          <span>${new Date(article.created_at).toLocaleDateString('ar-SA')}</span>
        </div>
        <a href="/article/${article.slug}">اقرأ المزيد →</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading articles:', error);
  }
}

// Perform search
async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  
  if (query.length < 2) {
    alert('يجب إدخال كلمة بحث على الأقل');
    return;
  }
  
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    // Redirect to search results page or display results
    displaySearchResults(data);
  } catch (error) {
    console.error('Error performing search:', error);
  }
}

// Display search results
function displaySearchResults(data) {
  const resultsHTML = `
    <div class="search-results">
      <h2>نتائج البحث عن: "${document.getElementById('searchInput').value}"</h2>
      
      ${data.articles.length > 0 ? `
        <div class="results-section">
          <h3>المقالات (${data.articles.length})</h3>
          <ul>
            ${data.articles.map(article => `
              <li>
                <a href="/article/${article.slug}">${article.title}</a>
                <p>${article.excerpt || 'بدون وصف'}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${data.tribes.length > 0 ? `
        <div class="results-section">
          <h3>القبائل (${data.tribes.length})</h3>
          <ul>
            ${data.tribes.map(tribe => `
              <li>
                <a href="/tribe/${tribe.slug}">${tribe.title}</a>
                <p>${tribe.excerpt || 'بدون وصف'}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${data.total === 0 ? '<p>لم يتم العثور على نتائج</p>' : ''}
    </div>
  `;
  
  // Create a temporary container and display results
  const resultsContainer = document.createElement('div');
  resultsContainer.innerHTML = resultsHTML;
  resultsContainer.style.cssText = 'margin: 2rem auto; max-width: 800px; padding: 2rem; background: white; border-radius: 8px;';
  
  // Insert after hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.parentNode.insertBefore(resultsContainer, heroSection.nextSibling);
  }
  
  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Allow Enter key to search
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
});
