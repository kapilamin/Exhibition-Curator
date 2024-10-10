// import React from 'react';

// const ArtworkCard = ({ artwork }) => {
//   return (
//     <div className="artwork-card">
//       <img src={artwork.image} alt={artwork.title} />
//       <h3>{artwork.title}</h3>
//       <p>Artist: {artwork.artist}</p>
//       <p>Source: {artwork.source}</p>
//     </div>
//   );
// };

// export default ArtworkCard;

// import React from 'react';

// const ArtworkCard = ({ artwork }) => {
//   return (
//     <div className="artwork-card">
//       {artwork.image ? (
//         <a href={artwork.image} target="_blank" rel="noopener noreferrer" className="artwork-image-link">
//           <div className="artwork-image-placeholder">
//             Click to view image
//           </div>
//         </a>
//       ) : (
//         <div className="artwork-image-placeholder">No image available</div>
//       )}
//       <h3>{artwork.title}</h3>
//       <p>Artist: {artwork.artist || 'Unknown'}</p>
//       <p>Source: {artwork.source}</p>
//     </div>
//   );
// };

// export default ArtworkCard;

import React from 'react';

const ArtworkCard = ({ artwork }) => {
  return (
    <div className="artwork-card">
      {artwork.image ? (
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'path/to/fallback/image.jpg';
          }}
        />
      ) : (
        <div className="artwork-image-placeholder">No image available</div>
      )}
      <h3>{artwork.title}</h3>
      <p>Artist: {artwork.artist || 'Unknown'}</p>
      <p>Source: {artwork.source}</p>
    </div>
  );
};

export default ArtworkCard;