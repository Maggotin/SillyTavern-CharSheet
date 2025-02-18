/**
 * @depricated is this shared?
 */
import config from "~/config";

import "./Header.scss";

const BASE_PATHNAME = config.basePathname;

export function Header({ hasMaxCharacters }: { hasMaxCharacters: boolean }) {
  return (
    <header className="page-header">
      <div className="page-header__backdrop"></div>
      <div className="page-header__extras">
        <div className="page-header__extra page-header__extra--content1">
          <section className="atf" role="complementary">
            {/* <!-- BREADCRUMBS --> */}
            <nav className="b-breadcrumb b-breadcrumb-a">
              {/* <!-- WRAPPER --> */}
              <ul
                className="b-breadcrumb-wrapper"
                data-itemscope=""
                data-itemtype="http://schema.org/BreadcrumbList"
              >
                {/* <!-- ITEM --> */}
                <li
                  className="b-breadcrumb-item"
                  data-itemprop="itemListElement"
                  data-itemscope=""
                  data-itemtype="http://schema.org/ListItem"
                >
                  <a href="/" rel="up" data-itemprop="item">
                    <span data-itemprop="name">Home</span>
                  </a>
                  <meta data-itemprop="position" content="1" />
                </li>

                {/* <!-- ITEM --> */}
                <li
                  className="b-breadcrumb-item"
                  data-itemprop="itemListElement"
                  data-itemscope=""
                  data-itemtype="http://schema.org/ListItem"
                >
                  <a href={BASE_PATHNAME} rel="up" data-itemprop="item">
                    <span data-itemprop="name">My Characters</span>
                  </a>
                  <meta data-itemprop="position" content="2" />
                </li>
              </ul>
            </nav>
          </section>
        </div>
        <div className="page-header__spacer"></div>
      </div>
      <div className="page-header__primary">
        <div className="page-heading">
          <div className="page-heading__content">
            <h1 className="page-title">My Characters</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
