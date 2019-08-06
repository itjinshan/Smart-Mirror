const styles = {
    grid:{
      display:'grid',
      gridTemplateColumns:"33.33% 33.33% 33.33%",
      gridTemplateRows:"1fr 1fr 1fr",
      padding:10,
      backgroundColor:'#000',
      
    },
    topLeft:{
      gridColumnStart:1,
      gridColumnEnd:2,
      gridRowStart:1,
      gridRowEnd:1,
      justifyContent:"left",
      textAlign:'left',
      border:'1px solid red'
    },
    topCenter:{
      gridColumnStart:2,
      gridColumnEnd:3,
      gridRowStart:1,
      gridRowEnd:1,
      justifyContent:"center",
      textAlign:'center',
      border:'1px solid red'
    },
    topRight:{
      gridColumnStart:3,
      gridColumnEnd:4,
      gridRowStart:1,
      gridRowEnd:1,
      justifyContent:"right",
      textAlign:'right',
      border:'1px solid red'
    },
    middleLeft:{
      gridColumnStart:1,
      gridColumnEnd:2,
      gridRowStart:2,
      gridRowEnd:2,
      justifyContent:"left",
      textAlign:'center',
      border:'1px solid red'
    },
    middleCenter:{
      gridColumnStart:2,
      gridColumnEnd:3,
      gridRowStart:2,
      gridRowEnd:2,
      justifyContent:"center",
      textAlign:'center',
      border:'1px solid red'
    },
    middleRight:{
      gridColumnStart:3,
      gridColumnEnd:4,
      gridRowStart:2,
      gridRowEnd:2,
      justifyContent:"right",
      textAlign:'center',
      border:'1px solid red'
    },
    bottomLeft:{
      gridColumnStart:1,
      gridColumnEnd:2,
      gridRowStart:3,
      gridRowEnd:3,
      justifyContent:"left",
      textAlign:'center',
      border:'1px solid red'
    },
    bottomCenter:{
      gridColumnStart:2,
      gridColumnEnd:3,
      gridRowStart:3,
      gridRowEnd:3,
      justifyContent:"center",
      textAlign:'center',
      border:'1px solid red'
    },
    bottomRight:{
      gridColumnStart:3,
      gridColumnEnd:4,
      gridRowStart:3,
      gridRowEnd:3,
      justifyContent:"right",
      textAlign:'center',
      border:'1px solid red'
    }
  }

  module.exports = styles;