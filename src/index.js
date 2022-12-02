import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
formEl.style.background = "blue"; 
formEl.style.display = "flex";
formEl.style.justifyContent = "center";
const galleryEl = document.querySelector('.gallery');  
//const galleryEl = document.createElement('div');
//galleryEl.classList.add('gallery');
//document.body.append(galleryEl);
let markup = "";
let counter;
let totalHits = 0;
document.body.insertAdjacentHTML("afterend", `<div class="footer"> <button type="button" class="load-more">Load more</button></div>`);
const btnNext = document.querySelector('.load-more');
btnNext.style.background = "blue";
btnNext.style.position = "relative";
btnNext.style.left = "50%"
btnNext.style.color = "yellow"
//btnNext.style.display = "flex";
//btnNext.style.justifyContent = "center";
btnNext.style.opacity = "0";



const createMarckup = function (response) {
  
  response.data.results.map((element) => {

      markup += `<div class="photo-card">
              <a class="gallery__item" href="https://www.themoviedb.org/t/p/original/${element.backdrop_path}">
              <img class="gallery__image" src="https://www.themoviedb.org/t/p/original/${element.poster_path}"
              
               alt="${element.original_title}" loading="lazy" /></a>
              <div class="info">
               
              </div>
            </div>`;
  });
  
  return markup;
} 

const fetchData = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=c491b5b8e2b4a9ab13619b0a91f8bb41`);
  return response;
}

const  getPixplay = function()  {
    
   fetchData().then((response) => {
    console.log(response.data);
   
    if (response.data.results.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');

    } else {
      
      galleryEl.innerHTML = createMarckup(response);
      document.querySelector('.load-more').style.opacity = "1";
      totalHits += response.data.length;
     let lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250, widthRatio: 0.1 });
      lightbox.show();
      if (totalHits === response.data.totalHits) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        
      } 
     
    }  
    }).catch((error) => {
      console.log(error);
    });
    
     
      //console.log("SIMPLE");
} 

btnNext.addEventListener("click", () => {
  counter++;
  
  getPixplay();

  //console.log("next ok");
  
});

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  markup = "";
  totalHits = 0;
  counter = 1;
  getPixplay();
   
});


window.addEventListener("scroll", () => {
   const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    
  
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  console.log(window.scrollY);
  if (scrollHeight - clientHeight == scrollTop) {
    //console.log(window);
    document.querySelector('.load-more').style.opacity = "0";
  } 
});
