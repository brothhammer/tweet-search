import React, {
  useEffect,
  useState,
}                                           from 'react';
import Tweet                                from './components/Tweet';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  makeStyles,
  OutlinedInput,
  Typography,
}                                           from '@material-ui/core';
import SearchIcon                           from '@material-ui/icons/Search';
import HashTag                              from "./components/HashTag";
import { getHashTags }                      from "./util";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fafafa',
  },
  content: {
    width: '100%',
    maxWidth: '70ch',
    backgroundColor: theme.palette.background.paper,
  },
  hashTagBox: {
    width: '100%',
    minWidth: '30ch',
    maxWidth: '70ch',
  },
  inline: {
    display: 'inline',
  },
}));

function App() {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [hashTags, setHashTags] = useState([]);
  const [placeholder, setPlaceholder] = useState('');
  const [next, setNext] = useState(false);

  const buttonHandler = () => {
    setNext(true);
  }

  const getResults= async (request) => {
    await fetch('http://localhost:4000/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(request),
    })
      .then((res) => res.json())
      .then((data) => {
        const nextResultsString = data.search_metadata.next_results;
        const maxID = nextResultsString
          ? nextResultsString.substring(nextResultsString.indexOf("=") +1, nextResultsString.indexOf("&"))
          : 0
        if(!next) {
          setResults(data.statuses);
          setHashTags(getHashTags(data.statuses));
          setPlaceholder(maxID);
        } else {
          setResults([...results, ...data.statuses.slice(5)]);
          // setHashTags([...new Set([...hashTags, ...getHashTags(data.statuses)])]);
          const dedupHashTags = [...new Set([...hashTags, ...getHashTags(data.statuses)])]
          setHashTags(dedupHashTags);
          setPlaceholder(maxID);
          setNext(false)
        }
      })
  }

  useEffect(() => {
      const request = { query: `q=${search}&result_type=popular&count=5` }
    if (search) {
      getResults(request);
  } else {
      setResults([])
      setHashTags([])
    }
  }, [search])


  useEffect(() => {
    const request = { query: `q=${search}&result_type=popular&since_id=${placeholder}`}
    if (next) {
      getResults(request);
    }
  }, [next])


  return (
    <>
    <div className={classes.root}>

        <Grid container justify="center">
          {/*INPUT*/}
          <Grid item lg={9} md={12} sm={12} xs={12}>
                <Box m={1} pt={2}>
                  <InputLabel style={{marginBottom: '2ch'}}>Tweet Feed</InputLabel>
                  <OutlinedInput
                    style={{width: '100%', maxWidth: '79ch'}}
                    className={classes.content}
                    id="input-with-icon-adornment"
                    type="text"
                    value={search}
                    placeholder="Search by keyword"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setNext(false);
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Box>
              </Grid>

          <Box clone order={{xs:3, sm:3, md: 3, lg: 2 }}>
            {/*TWEETS*/}
            <Grid item lg={6} md={12} sm={12} xs={12}>
              {(results.length !== 0) &&
              <Box m={1} pt={2}>
                <List className={classes.content}
                      style={{borderWidth: 1, borderColor: 'lightgrey', borderStyle: 'solid', borderRadius:8}}>
                  {results.map((result, key) => (
                    <Tweet
                      key={key}
                      index={key}
                      result={result}
                      onClick={(hashTag) => setSearch(hashTag)}
                    />
                  ))}
                  <Grid container justify = "center">
                    <Button
                      color="primary"
                      onClick={buttonHandler}>
                      Load more
                    </Button>
                  </Grid>
                </List>
              </Box>
              }
            </Grid>
          </Box>

          <Box clone order={{xs:2, sm:2, md: 2, lg: 3 }}>
            {/*HASHTAGS*/}
            <Grid item lg={3} md={3} sm={3} xs={12}>
              {(hashTags.length !== 0) &&
              <Box m={1} pt={2}>
                <Card variant="outlined" className={classes.hashTagBox}>
                  <CardContent>
                    <Typography>Filter by hashtag</Typography>
                    {hashTags.map((hashTag, key) => (
                      <span key={key}>
                        <HashTag hashTag={hashTag} onClick={() => {
                          setSearch(hashTag)}}/>
                      </span>
                    ))}
                  </CardContent>
                </Card>
               </Box>
              }
            </Grid>
          </Box>
        </Grid>
    </div>
    </>
  )
}

export default App;
