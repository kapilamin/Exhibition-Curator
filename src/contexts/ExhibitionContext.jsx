import React, { createContext, useState, useEffect } from 'react';

export const ExhibitionContext = createContext();

export const ExhibitionProvider = ({ children }) => {
  const [exhibition, setExhibition] = useState([]);

  useEffect(() => {
    const savedArtworks = JSON.parse(sessionStorage.getItem('selectedArtworks') || '[]');
    setExhibition(savedArtworks);
  }, []);

  const addToExhibition = (artwork) => {
    if (!exhibition.some(item => item.id === artwork.id)) {
      const updatedExhibition = [...exhibition, artwork];
      setExhibition(updatedExhibition);
      sessionStorage.setItem('selectedArtworks', JSON.stringify(updatedExhibition));
    }
  };

  const removeFromExhibition = (artworkId) => {
    const updatedExhibition = exhibition.filter(item => item.id !== artworkId);
    setExhibition(updatedExhibition);
    sessionStorage.setItem('selectedArtworks', JSON.stringify(updatedExhibition));
  };

  return (
    <ExhibitionContext.Provider value={{ exhibition, addToExhibition, removeFromExhibition }}>
      {children}
    </ExhibitionContext.Provider>
  );
};