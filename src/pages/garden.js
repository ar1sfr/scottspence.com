import { graphql } from 'gatsby'
import React, { useState } from 'react'
import SEO from 'react-seo-component'
import styled from 'styled-components'
import { H2, P } from '../components/page-elements'
import { PostInfo, StyledLink } from '../components/shared-styles'
import { useSiteMetadata } from '../hooks/use-site-metadata'
import { ogImageUrl } from '../util/build-og-image-url'

const Wrapper = styled.main`
  input {
    margin-top: ${({ theme }) => theme.spacing[12]};
    font-size: ${({ theme }) => theme.fontSize.lg};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.gray[500]};
    padding: ${({ theme }) => theme.spacing[1]};
    outline: none;
    &:focus {
      box-shadow: ${({ theme }) => theme.boxShadow.outline};
    }
  }
  .posts-number {
    margin: -${({ theme }) => theme.spacing[6]};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary[500]};
  }
  article {
    margin: ${({ theme }) => theme.spacing[8]} 0;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    color: ${({ theme }) => theme.colors.gray[900]};
    padding: ${({ theme }) => theme.spacing[4]};
    h2 {
      margin-top: 0;
    }
    p {
      margin-top: ${({ theme }) => theme.spacing[2]};
    }
    a {
      &:focus {
        display: block;
      }
    }
    overflow: hidden;
    &:before {
      position: relative;
      display: block;
      margin: 0 -17px;
      width: 108%;
      height: 5px;
      top: -16px;
      content: '';
      background: linear-gradient(
        0.25turn,
        var(
          --title-gradient-from,
          ${({ theme }) => theme.colors.primary[200]}
        ),
        var(
          --title-gradient-to,
          ${({ theme }) => theme.colors.primary[500]}
        )
      );
    }
  }
`

export default ({ data }) => {
  const {
    title,
    description,
    siteUrl,
    twitterUsername,
    authorName,
    siteLanguage,
    siteLocale,
  } = useSiteMetadata()
  // https://www.aboutmonica.com/blog/create-gatsby-blog-search-tutorial
  const allPosts = data.allMdx.nodes

  const emptyQuery = ''

  const [state, stateSet] = useState({
    filteredData: [],
    query: emptyQuery,
  })

  const handleInputChange = e => {
    const query = e.target.value
    const posts = data.allMdx.nodes || []

    const filteredData = posts.filter(post => {
      const { title, tags } = post.frontmatter
      return (
        title.toLowerCase().includes(query.toLowerCase()) ||
        (tags &&
          tags.join('').toLowerCase().includes(query.toLowerCase()))
      )
    })

    stateSet({ query, filteredData })
  }

  const { filteredData, query } = state
  const hasSearchResults = filteredData && query !== emptyQuery
  const posts = hasSearchResults ? filteredData : allPosts

  return (
    <>
      <SEO
        title={`Garden`}
        titleTemplate={title}
        description={description}
        image={ogImageUrl(
          authorName,
          'scottspence.com',
          `Digital Garden`
        )}
        pathname={siteUrl}
        siteLanguage={siteLanguage}
        siteLocale={siteLocale}
        twitterUsername={twitterUsername}
      />
      <Wrapper>
        <input
          type="text"
          aria-label="Search"
          placeholder="Type to filter posts..."
          onChange={handleInputChange}
        />
        <span className="posts-number">
          {Object.keys(posts).length}
        </span>
        {posts.map(post => {
          const {
            id,
            excerpt,
            fields: { slug },
            frontmatter: { title },
            timeToRead,
          } = post
          return (
            <article key={id}>
              <StyledLink to={slug}>
                <H2>{title}</H2>
                <PostInfo>
                  <span className="postTimeToRead">
                    {timeToRead * 2} minutes to read
                  </span>
                </PostInfo>
                <P>{excerpt}</P>
              </StyledLink>
            </article>
          )
        })}
      </Wrapper>
    </>
  )
}

export const query = graphql`
  query SITE_INDEX_QUERY {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { private: { eq: false } } }
    ) {
      nodes {
        id
        excerpt(pruneLength: 100)
        frontmatter {
          title
        }
        timeToRead
        fields {
          slug
        }
      }
    }
  }
`
