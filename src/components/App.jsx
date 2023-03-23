import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import { getImages } from './services/pixabayAPI';
import ImageGallery from './ImageGallery/ImageGallery';
import ButtonMore from './Button/ButtonMore';
import Loader from './Loader/Loaader';
import Modal from './Modal/Modal';
import css from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pics, setPics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadBtn, setLoadBtn] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [bigImage, setBigImage] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchPic = async () => {
      try {
        setIsLoading(true);
        const response = await getImages(query, page);
        const mathPages = Math.ceil(response.data.totalHits / 12);

        if (page === mathPages) {
          setIsLoading(false);
          setLoadBtn(false);
          alert('The end');
          // return;
        }
        if (response.data.hits.length === 0) {
          alert('No results found');
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        setPics(prevState => [...prevState, ...response.data.hits]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPic();
  }, [query, page]);

  const onSearch = SearchItem => {
    setQuery(SearchItem);
    setPage(1);
    setPics([]);
    setLoadBtn(true);
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const openModal = image => {
    setIsModal(true);
    setBigImage(image);
  };

  const closeModal = () => {
    setBigImage('');
    setIsModal(false);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={onSearch} />
      <ImageGallery images={pics} onImageClick={openModal} />
      {isLoading && <Loader />}
      {loadBtn && <ButtonMore onLoadMore={loadMore} />}
      {isModal && (
        <Modal onClose={closeModal} src={bigImage} alt={query}></Modal>
      )}
    </div>
  );
};

export default App;
