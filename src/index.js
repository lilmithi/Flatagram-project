// write your code here
document.addEventListener("DOMContentLoaded", () => {
  const h2 = document.querySelector("h2#card-title");
  const img = document.querySelector("img#card-image");
  const commentsUl = document.querySelector("ul#comments-list");
  const form = document.querySelector("form#comment-form");
  const likeBtn = document.querySelector("button#like-button");
  const likeCount = document.querySelector("span#like-count");

  fetch("http://localhost:3000/images/1")
    .then((resp) => resp.json())
    .then((imgresp) => {
      h2.textContent = imgresp.title;
      img.src = imgresp.image;
      likeCount.textContent = `${imgresp.likes} likes`;
      likeBtn.addEventListener("click", () => {
        fetch("http://localhost:3000/images/1", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ likes: (imgresp.likes += 1) }),
        })
          .then((resp) => resp.json())
          .then((likes) => {
            likeCount.textContent = `${likes.likes} likes`;
          });
      });
      img.addEventListener("click", () => {
        fetch("https://dog.ceo/api/breeds/image/random ")
          .then((resp) => resp.json())
          .then((newImg) => {
            img.src = newImg.message;
            fetch("http://localhost:3000/images/1", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ image: newImg.message }),
            })
              .then((resp) => resp.json())
              .then((UpdateImg) => {
                img.src = UpdateImg.image;
              });
          });
      });
    });
  fetch("http://localhost:3000/comments")
    .then((resp) => resp.json())
    .then((comments) => {
      comments.forEach((comment) => {
        const li = document.createElement("li");
        li.append(comment.content);
        commentsUl.appendChild(li);
        li.addEventListener("click", () => {
          if (li.textContent === comment.content) {
            fetch(`http://localhost:3000/comments/${comment.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
              .then((resp) => resp.json())
              .then(() => {
                li.remove();
              })
              .catch(() => alert("Delete error!"));
          }
        });
      });
    });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ imageId: 1, content: e.target.comment.value }),
    })
      .then((resp) => resp.json())
      .then((comment) => {
        const li = document.createElement("li");
        li.append(comment.content);
        commentsUl.appendChild(li);
      });
    form.reset();
  });
});
