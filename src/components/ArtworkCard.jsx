import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ExternalLink } from 'lucide-react';

const ArtworkCard = ({ artwork, onAddToExhibition, onRemove }) => {
  console.log('Creating link with:', { source: artwork.source, id: artwork.id });
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-square relative">
        {artwork.image ? (
          <Link to={`/artwork/${artwork.source}/${artwork.id}`} className="block">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-artwork.jpg';
              }}
            />
          </Link>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No image available
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">
          <Link 
            to={`/artwork/${artwork.source}/${artwork.id}`}
            className="hover:text-purple-600 transition-colors"
          >
            {artwork.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mt-1 mb-2">
          {artwork.artist || 'Unknown Artist'}
        </p>
        
        {artwork.date && (
          <p className="text-gray-500 text-sm mb-4">
            {artwork.date}
          </p>
        )}

        <div className="flex items-center justify-between">
          {onAddToExhibition && (
            <button
              onClick={() => onAddToExhibition(artwork)}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add</span>
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={() => onRemove(artwork.id)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
            >
              <Minus size={16} />
              <span className="text-sm font-medium">Remove</span>
            </button>
          )}
          
          <Link
            to={`/artwork/${artwork.source}/${artwork.id}`}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors ml-auto"
          >
            <span className="text-sm font-medium">View Details</span>
            <ExternalLink size={16} />
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Source: {artwork.source === 'met' ? 'Metropolitan Museum of Art' : 'Harvard Art Museums'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Plus } from 'lucide-react';

// const ArtworkCard = ({ artwork, onAddToExhibition }) => {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
//       <Link to={`/artwork/${artwork.source}/${artwork.id}`}>
//         <div className="aspect-square relative">
//           <img
//             src={artwork.image}
//             alt={artwork.title}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = '/placeholder-artwork.jpg';
//             }}
//           />
//           {/* Overlay with title on hover */}
//           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
//             <h3 className="text-white text-sm font-medium line-clamp-2">
//               {artwork.title}
//             </h3>
//             <p className="text-white/80 text-xs">
//               {artwork.artist || 'Unknown Artist'}
//             </p>
//           </div>
          
//           {/* Add to Exhibition button overlay */}
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               onAddToExhibition(artwork);
//             }}
//             className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
//                      bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
//             aria-label="Add to Exhibition"
//           >
//             <Plus size={16} />
//           </button>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default ArtworkCard;