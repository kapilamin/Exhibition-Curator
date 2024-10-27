import React, { useState } from 'react';
import { useExhibition } from '../contexts/ExhibitionContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Share2, Download, Save } from 'lucide-react';

const SortableArtworkCard = ({ artwork }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const { removeFromExhibition } = useExhibition();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isDragging ? 'shadow-xl opacity-75' : ''
      }`}
    >
      <div className="flex p-4 gap-4">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="text-gray-400" />
        </div>
        
        <div className="relative aspect-square w-32 flex-shrink-0">
          <img
            src={artwork.image || '/placeholder-artwork.jpg'}
            alt={artwork.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{artwork.title}</h3>
              <p className="text-sm text-gray-600">{artwork.artist || 'Unknown Artist'}</p>
              <p className="text-sm text-gray-500">{artwork.date}</p>
            </div>
            
            <button
              onClick={() => removeFromExhibition(artwork.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove artwork"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            <p>{artwork.medium}</p>
            <p>{artwork.dimensions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExhibitionCreator = () => {
  const { exhibition, setExhibition } = useExhibition();
  const [title, setTitle] = useState('My Exhibition');
  const [description, setDescription] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = exhibition.findIndex((item) => item.id === active.id);
      const newIndex = exhibition.findIndex((item) => item.id === over.id);
      
      setExhibition(arrayMove(exhibition, oldIndex, newIndex));
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const handleExport = () => {
    const exhibitionData = {
      title,
      description,
      artworks: exhibition.map(artwork => ({
        title: artwork.title,
        artist: artwork.artist,
        date: artwork.date,
        medium: artwork.medium,
        source: artwork.source,
        link: artwork.link
      }))
    };
    
    const blob = new Blob([JSON.stringify(exhibitionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
          placeholder="Exhibition Title"
        />
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add a description for your exhibition..."
          rows={3}
        />
        
        <div className="flex gap-4">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Share2 size={16} className="mr-2" />
            Share
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {exhibition.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Your exhibition is empty. Add some artworks from the search page!</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={exhibition.map(a => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {exhibition.map((artwork) => (
                <SortableArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ExhibitionCreator;