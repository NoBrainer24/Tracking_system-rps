"use client";
import React, { useEffect, useState } from "react";
import { fetchBookId, fetchDeleteBook } from "@/app/api";
import classes from "./settingsBook.module.css";
import Image from "next/image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";

const SettingsBook = (ctx) => {
  const id = ctx.params.id;
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();

  const [bookDetail, setBookDetail] = useState();
  const [page, setPage] = useState();
  const [language, setLanguage] = useState();
  const [bookDate, setBookDate] = useState();
  const [bookName, setBookName] = useState();
  const [author, setAuthor] = useState();
  const [rating, setRating] = useState();
  const [description, setDescription] = useState();
  const [genres, setGenres] = useState([]);
  const [newGenres, setNewGenres] = useState();
  useEffect(() => {
    async function fecthBook() {
      const data = await fetchBookId(id);
      setBookDetail(data);
      setPage(data?.pages);
      setLanguage(data?.language);
      setBookDate(data?.years);
      setBookName(data?.title);
      setAuthor(data?.author);
      setRating(data?.rating);
      setDescription(data?.description);
      setGenres(data?.genres);
    }
    fecthBook();
  }, []);
  console.log(bookDetail);

  const DeleteBook = async () => {
    const confirmDeletion = window.confirm(
      "Bu öğeyi silmek istediğinize emin misiniz?"
    );
    if (confirmDeletion) {
      try {
        await fetchDeleteBook(token, id);
        toast.success("Kitap başarıyla silindi");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error) {
        toast.error("Silme işlemi sırasında bir hata oluştu");
      }
    } else {
      toast.warn("Silme işlemi iptal edildi");
    }
  };

  const handleDeleteGenres = async ({ index }) => {
    const updatedGenres = [...genres];
    updatedGenres.splice(index, 1);
    setGenres(updatedGenres);
  };

  const handleAddGenres = async (event) => {
    if (event.key === "Enter") {
      const updatedGenres = [...genres, event.target.value];
      setGenres(updatedGenres);
      setNewGenres("");
    }
  };
  console.log(genres);
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.imgContainer}>
          <Image
            alt="settingsBookImage"
            src={bookDetail?.coverImage}
            width={200}
            height={400}
            className={classes.coverImage}
          />
          <button className={classes.buttonGreen}>Resim Seç</button>
          <button>Resim Yükle</button>
          <div className={classes.bookDetailPage}>
            <div className={classes.bilgiTitle}>
              <span>Sayfa Sayısı : </span>
              <span>Dil : </span>
              <span>Yayın Yılı : </span>
            </div>
            <div className={classes.bilgi}>
              <input
                value={page}
                type="number"
                placeholder="Sayfa Sayısı..."
                onChange={(e) => setPage(e.target.value)}
              />
              <input
                value={language}
                type="text"
                placeholder="Dil..."
                onChange={(e) => setLanguage(e.target.value)}
              />
              <input
                value={bookDate}
                type="number"
                placeholder="Çıkış Tarihi..."
                onChange={(e) => setBookDate(e.target.value)}
              />
            </div>
          </div>
          <button className={classes.deleteButton} onClick={DeleteBook}>
            Kitabı Sil
          </button>
        </div>
        <div className={classes.inputBox}>
          <div className={classes.inputContainer}>
            <span>
              <h4>İsim:</h4>
              <input
                value={bookName}
                type="text"
                placeholder="Kitap İsmi..."
                onChange={(e) => setBookName(e.target.value)}
              />
            </span>
            <span>
              <h4>Yazar:</h4>
              <input
                value={author}
                type="text"
                placeholder="Yazar İsmi..."
                onChange={(e) => setAuthor(e.target.value)}
              />
            </span>
            <span>
              <h4>Puan:</h4>
              <input
                value={rating}
                type="number"
                min={0}
                max={5}
                placeholder="Puan..."
                onChange={(e) => setRating(e.target.value)}
              />
            </span>
            <span className={classes.genresSpan}>
              <h4>Tür:</h4>
              <ul>
                {genres?.map((item, index) => (
                  <li key={index}>
                    {item}
                    <AiOutlineClose
                      onClick={() => handleDeleteGenres((index = { index }))}
                      className={classes.genresClose}
                    />
                  </li>
                ))}
                <li className={classes.genresLi}>
                  <input
                    placeholder="Tür giriniz..."
                    type="text"
                    value={newGenres}
                    onChange={(e) => setNewGenres(e.target.value)}
                    onKeyDown={(e) => handleAddGenres(e)}
                    className={classes.genresInput}
                  />
                </li>
              </ul>
            </span>
          </div>
          <ReactQuill
            value={description}
            onChange={(e) => setDescription(e)}
            placeholder="Hikayen..."
            className={classes.description}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SettingsBook;
