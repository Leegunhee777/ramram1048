// "/product/:pid"에서 상품 상세정보 확인하는 페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import clsx from "clsx";
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Divider,
    Button,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core'
import {
  orange
} from '@material-ui/core/colors'
import {
  Delete as DeleteIcon
} from '@material-ui/icons'

import queryString from 'query-string'
import NoMatch from './NoMatch'

const useStyles = makeStyles((theme) => ({
    root:{
      flexGrow: 1,
      '& > *': {
        padding: theme.spacing(1),
      },
    },
    thumbnail: {
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    price: {
      color: theme.palette.primary.main
    },
    formControl: {
      width: '100%',
    },
    table: {

    },
    hide: {
      display: 'none',
    },
    contentPanel: {
      
    }
}));

const ProductDetail = ({pathname, search}) => {
    const [pid, setPid] = useState(0);
    const [data, setData] = useState(null);
    const [detail, setDetail] = useState([]);
    const [review, setReview] = useState([]);
    const [optionMenu, setOptionMenu] = useState("");
    const [optionArray, setOptionArray] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        setPid(pathname.substring(pathname.lastIndexOf('/') + 1));
        //if(!pid.isInteger) return(<NoMatch/>);
        fetch("http://localhost:3000/product/"+pid)
          .then(res => res.json())
          .then(json => {
            setData(json.result[0]);
            console.log(json.detail.length);
            if(json.detail.length === 0){
              setDetail([{
                id: 1, productId: pid, color: "테스트용 기본", size: "기본", cnt: 100
              }])
              console.log(detail)
            }
            else{setDetail(json.detail)};
            setReview(json.rows);
    })}, []);

    const addList = (event) => {
      const index = event.target.value;
      setOptionMenu(""); // event.preventDefault();
      if(!optionArray.includes(index)){ // check duplicate option
        setOptionArray([...optionArray, index]); // push index into optionArray
      }
    }

    const removeList = (index) => {
      const newList = [...optionArray];
      newList.splice(index, 1);
      setOptionArray(newList);
    }

    if(!pid || !data || !detail) return(<div>loading</div>)
    // console.log(data);
    // console.log(detail);
    const optionMenuItem = detail.map((option, index) => {
        return(
          <MenuItem value={index}>{option.color} / {option.size}</MenuItem>
    )})
    const optionRow = optionArray.map((optionIdx) => {
      return(
        <TableRow>
          <TableCell>{detail[optionIdx].color} / {detail[optionIdx].size}</TableCell>
          <TableCell>개수</TableCell>
          <TableCell align="right"><strong className={classes.price}>{data.price}</strong>원</TableCell>
          <TableCell><Button variant="outlined">입혀보기</Button></TableCell>
          <TableCell><IconButton 
          aria-label="delete"
          onClick={removeList}>
              <DeleteIcon />
            </IconButton></TableCell>
        </TableRow>
      )
    })

    return(
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={5} className={classes.thumbnail}>
            <img src={data.img} maxHeight="500px"/>
          </Grid>
          <Grid item xs={12} sm={7} container>
            <Grid item xs component={Paper} direction="column" spacing={1}>
              <Grid item xs>
                <Typography variant="subtitle1" gutterBottom>{data.seller}</Typography>
                <Typography variant="h6" gutterBottom>{data.pname}</Typography>
                <Divider variant="middle"/>
                <Typography variant="subtitle2" gutterBottom><strong className={classes.price}>{data.price}</strong>원</Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                  <Select
                    value={optionMenu}
                    onChange={addList}
                    displayEmpty
                    className={classes.selectEmpty}
                  >
                    <MenuItem value="" disabled>
                      = 사이즈, 색상 선택 =
                    </MenuItem>
                    {optionMenuItem}
                  </Select>
                </FormControl>
                <Table className={clsx({
                  [classes.formControl]: true,
                  [classes.hide] : optionArray.length == 0
                  })} aria-label="spanning table">
                  <TableBody>
                    {optionRow}
                    <TableRow>
                      <TableCell colSpan={2} align="right">총 합계금액</TableCell>
                      <TableCell colSpan={2} align="right"><strong className={classes.price}>얼마얼마</strong>원</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Divider variant="middle"/>
                <Button variant="outlined">입혀보기</Button>
                <Button variant="outlined">장바구니</Button>
                <Button variant="outlined">바로구매</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.contentPanel} square>
              <Typography variant="h6" align="center" gutterBottom>상품상세정보</Typography>
              <Divider variant="middle"/>
              <img src={data.description} />
            </Paper>
          </Grid>
        </Grid>
    )
  }

  ProductDetail.propTypes = {
    pathname: PropTypes.string,
    search: PropTypes.string,
    //hash: PropTypes.string,
  }
  

  const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
    search: state.router.location.search,
    //hash: state.router.location.hash,
  })
  
  export default connect(mapStateToProps)(ProductDetail)