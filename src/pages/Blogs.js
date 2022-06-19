import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../redux/blogRedux";
import { useEffect } from "react";
import Footer from "../components/Footer";

const Blogs = ({ blogs, totalPosts }) => {
  const dispatch = useDispatch();
  const { postsPerPage } = useSelector((state) => state.blogRedux);
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, []);

  const paginate = (number) => {
    dispatch(setCurrentPage(number));
  };
  return (
    <>
      <section id="blogs" className="py-5 my-5">
        <div className="container">
          <div className="title text-center py-5">
            <h2 className="position-relative d-inline-block">
              Our Latest Blog
            </h2>
          </div>
          <div className="row g-3">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="card border-0 col-md-6 col-lg-4 bg-transparent my-3"
              >
                <img
                  style={{ maxHeight: "300px" }}
                  className="img-fluid img-thumbnail rounded"
                  src={blog.media}
                  alt="Blog"
                />
                <div className="card-body px-0">
                  <h4 className="card-title">{blog.title}</h4>
                  <p className="card-text mt-3 text-muted">{blog.summary}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      <span className="fw-bold">Author: </span>
                      {blog.author}
                    </small>
                  </p>
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={totalPosts}
          paginate={paginate}
        />
      </section>
      <Footer />
    </>
  );
};

export default Blogs;
