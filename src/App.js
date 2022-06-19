import Navbar from "./components/Navbar";
import Collection from "./pages/Collection";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Favorite from "./pages/Favorite";
import axios from "axios";
import useQueryBarang from "./graphql/QueryBarang";
import { useQueryCart, queryCart } from "./graphql/QueryCart";
import { useQueryFavourite } from "./graphql/QueryFavourite";
import { useDispatch, useSelector } from "react-redux";
import { setDataBlogs, setLoadingBlogs } from "./redux/blogRedux";
import NotFound from "./pages/NotFound";

function App() {
  const { data, loading } = useQueryBarang();
  const { data: dataCart, loading: loadingCart } = useQueryCart();
  const { data: dataFav, loading: loadingFav } = useQueryFavourite();

  const dispatch = useDispatch();

  const { postsPerPage } = useSelector((state) => state.blogRedux);
  const { loadingBlogs } = useSelector((state) => state.blogRedux);
  const { dataBlogs } = useSelector((state) => state.blogRedux);
  const { currentPage } = useSelector((state) => state.blogRedux);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoadingBlogs(true));
      try {
        const { data: response } = await axios.get(
          "https://free-news.p.rapidapi.com/v1/search",
          {
            params: {
              q: "Nature",
              lang: "en",
            },
            headers: {
              "X-RapidAPI-Key":
                "19469e81e7msh457cf9e13a26d9bp1a3806jsn5bb2191495bd",
              "X-RapidAPI-Host": "free-news.p.rapidapi.com",
            },
          }
        );
        dispatch(setDataBlogs(response.articles));
      } catch (error) {
        console.error(error.message);
      }
      dispatch(setLoadingBlogs(false));
    };

    fetchData();
  }, []);

  //Get Current Blogs
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dataBlogs.slice(indexOfFirstPost, indexOfLastPost);

  if (loading || loadingFav || loadingCart || loadingBlogs)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <CircularProgress />
        <p>Loading</p>
      </div>
    );
  //Get Total Biaya
  let totalBiaya = 0;
  const biaya = dataCart.kampus_merdeka_cart.map(
    (item) => +item.barang.harga * 1000 * item.kuantitas
  );
  //Penambahan titik setiap 3 bilangan dari belakang
  if (biaya[0] !== undefined) {
    totalBiaya = biaya
      .reduce((a, b) => a + b)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <div className="App mx-auto">
      <Navbar
        cartLength={dataCart.kampus_merdeka_cart.length}
        favLength={dataFav.kampus_merdeka_favorite.length}
      />
      <Routes>
        <Route
          index
          element={
            <Home
              data={data.kampus_merdeka_barang}
              favorite={dataFav.kampus_merdeka_favorite}
            />
          }
        />
        <Route
          path="collection"
          element={
            <Collection
              data={data.kampus_merdeka_barang}
              favorite={dataFav.kampus_merdeka_favorite}
            />
          }
        >
          <Route
            path=":id"
            element={<Detail data={data.kampus_merdeka_barang} />}
          />
        </Route>
        <Route
          path="blogs"
          element={<Blogs blogs={currentPosts} totalPosts={dataBlogs.length} />}
        />
        <Route path="about" element={<About />} />
        <Route
          path="cart"
          element={
            <Cart
              items={dataCart.kampus_merdeka_cart}
              totalBiaya={totalBiaya}
            />
          }
        />
        <Route
          path="favorite"
          element={<Favorite items={dataFav.kampus_merdeka_favorite} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
