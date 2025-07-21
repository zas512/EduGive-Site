import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import PageLinks from "@/components/common/PageLinks";

import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import React from "react";
import BlogDetails from "@/components/blogs/BlogDetails";
import Preloader from "@/components/common/Preloader";

export default function page({ params }) {
  return (
    <div className="main-content  ">
      <Preloader />

      <Header />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks />

        <BlogDetails id={params.id} />

        <RelatedBlogs />

        <FooterOne />
      </div>
    </div>
  );
}
