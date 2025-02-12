const SemesterByCourse=(session,course)=>{
      
if(session==='201819'){
    //****************************2018-2019****************************
    if(course==='other'){
        return([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
      {label:'B.S.C-Agriculture Semester 2',value:'BSC-AG%20II'},
      ])
        
    }else if(course==='otherc'){
        return([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 1 OCT-19', value: 'BAMS%20I-OCT19' },
        { label: 'B.A.M.S Semester 2 OCT-19', value: 'BAMS%20II-OCT19' },
        { label: 'B.A.M.S Semester 3 OCT-19', value: 'BAMS%20III-OCT19' },
        { label: 'B.A.M.S Semester 4 OCT-19', value: 'BAMS%20IV-OCT19' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
      {label:'B.S.C-Agriculture Semester 2',value:'BSC-AG%20II'},
      ])
        
    }else if(course==='diploma'|| course==='diplomac'){
        return([
        { label: 'Diploma Semester1', value: '1' },
        { label: 'Diploma Semester 2', value: '2' },
        { label: 'Diploma Semester 3', value: '3' },
        { label: 'Diploma Semester 4', value: '4' },
        { label: 'Diploma Semester 5', value: '5' },
        { label: 'Diploma Semester 6', value: '6' },
        { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
        { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
      ])
    }
    }else if(session==='201920'){
      if(course==='other'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
          { label: 'B.A.M.S Semester 4-OCT20', value: 'BAMS%20IV-OCT20' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.A YOGA',value:'BA%20YOGA'},
        ])
          
      }else if(course==='otherc'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
          { label: 'B.A.M.S Semester 1-OCT19', value: 'BAMS%20I-OCT19' },
          { label: 'B.A.M.S Semester 2-OCT19', value: 'BAMS%20II-OCT19' },
          { label: 'B.A.M.S Semester 3-OCT19', value: 'BAMS%20III-OCT19' },
          { label: 'B.A.M.S Semester 4-OCT19', value: 'BAMS%20IV-OCT19' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
        {label:'B.S.C-Agriculture Semester 2',value:'BSC-AG%20II'},
        ])
          
      }else if(course==='diploma'|| course==='diplomac'){
          return([
          { label: 'Diploma Semester1', value: '1' },
          { label: 'Diploma Semester 2', value: '2' },
          { label: 'Diploma Semester 3', value: '3' },
          { label: 'Diploma Semester 4', value: '4' },
          { label: 'Diploma Semester 5', value: '5' },
          { label: 'Diploma Semester 6', value: '6' },
          { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
          { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
        ])
      }
      
    } else if(session==='202021' ){
      if(course==='other'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
          { label: 'B.A.M.S Semester 4-OCT20', value: 'BAMS%20IV-OCT20' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
        {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.A YOGA',value:'BA%20YOGA'},
        ])
          
      }else if(course==='otherc'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
          { label: 'B.A.M.S Semester 1-DEC21', value: 'BAMS%20I-DEC21' },
          { label: 'B.A.M.S Semester 2-DEC21', value: 'BAMS%20II-DEC21' },
          { label: 'B.A.M.S Semester 3-DEC21', value: 'BAMS%20III-DEC21' },
          { label: 'B.A.M.S Semester 4-DEC21', value: 'BAMS%20IV-DEC21' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
        {label:'B.A YOGA',value:'BA%20YOGA'},
        {label:'B.A YOGA',value:'BA%20YOGA'},     
        ])
          
      }else if(course==='diploma'|| course==='diplomac'){
          return([
          { label: 'Diploma Semester1', value: '1' },
          { label: 'Diploma Semester 2', value: '2' },
          { label: 'Diploma Semester 3', value: '3' },
          { label: 'Diploma Semester 4', value: '4' },
          { label: 'Diploma Semester 5', value: '5' },
          { label: 'Diploma Semester 6', value: '6' },
          { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
          { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
        ])
      }
    }else if(session==='202122'){
      if(course==='other' || course==='bpodd'|| course==='bpeven'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'UG & PG Semester 9', value: '9' },
          { label: 'UG & PG Semester 10', value: '10' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
          { label: 'B.A.M.S Semester 4-OCT20', value: 'BAMS%20IV-OCT20' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
        {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.A YOGA',value:'BA%20YOGA'},   
        ])
          
      }else if(course==='otherc'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'UG & PG Semester 9', value: '9' },
          { label: 'UG & PG Semester 10', value: '10' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
          { label: 'B.A.M.S Semester 1-OCT22', value: 'BAMS%20IV-OCT22' },
          { label: 'B.A.M.S Semester 2-OCT22', value: 'BAMS%20IV-OCT22' },
          { label: 'B.A.M.S Semester 2-APR23', value: 'BAMS%20IV-APR23' },
          { label: 'B.A.M.S Semester 3-OCT22', value: 'BAMS%20IV-OCT22' },
          { label: 'B.A.M.S Semester 3-JAN23', value: 'BAMS%20IV-JAN23' },
          { label: 'B.A.M.S Semester 4-JAN23', value: 'BAMS%20IV-JAN23' },
          { label: 'B.A.M.S Semester 4-APR23', value: 'BAMS%20IV-APR23' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
        {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.A YOGA',value:'BA%20YOGA'},   
        ])
          
      }else if(course==='bpspc'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },])
            
      }else if(course==='diploma'|| course==='diplomac'){
          return([
          { label: 'Diploma Semester1', value: '1' },
          { label: 'Diploma Semester 2', value: '2' },
          { label: 'Diploma Semester 3', value: '3' },
          { label: 'Diploma Semester 4', value: '4' },
          { label: 'Diploma Semester 5', value: '5' },
          { label: 'Diploma Semester 6', value: '6' },
          { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
          { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
        ])
      }
  
    }else if(session==='202223' ||session==='202324'){
      if(course==='other' ){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'UG & PG Semester 9', value: '9' },
          { label: 'UG & PG Semester 10', value: '10' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
        {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.A YOGA',value:'BA%20YOGA'},   
        {label:'PG AYURVEDA',value:'PG%AYURVEDA'},   
        ])
          
      }else if(course==='otherc'|| course==='otheroddc'||course==='otherevenc'){
          return([  
          { label: 'UG & PG Semester1', value: '1' },
          { label: 'UG & PG Semester 2', value: '2' },
          { label: 'UG & PG Semester 3', value: '3' },
          { label: 'UG & PG Semester 4', value: '4' },
          { label: 'UG & PG Semester 5', value: '5' },
          { label: 'UG & PG Semester 6', value: '6' },
          { label: 'UG & PG Semester 7', value: '7' },
          { label: 'UG & PG Semester 8', value: '8' },
          { label: 'UG & PG Semester 9', value: '9' },
          { label: 'UG & PG Semester 10', value: '10' },
          { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
          { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
          { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
          { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
  
          { label: 'B.A.M.S Semester 1-OCT22', value: 'BAMS%20I-OCT22' },
          { label: 'B.A.M.S Semester 2-OCT22', value: 'BAMS%20II-OCT22' },
          { label: 'B.A.M.S Semester 2-APR23', value: 'BAMS%20II-APR23' },
          { label: 'B.A.M.S Semester 3-DEC23', value: 'BAMS%20III-DEC23' },
          { label: 'B.A.M.S Semester 4-DEC23', value: 'BAMS%20IV-DEC23' },
  
        {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
        {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
        {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
        {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
        {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
        {label:'B.E.D Semester 1' , value:'BED%20I'},
        {label:'B.E.D Semester 2' , value:'BED%20II'},
        {label:'B.A YOGA',value:'BA%20YOGA'},   
        ])
          
      }else if(course==='bpodd' || course==='bpeven' || course==='bpspc'){
          return([
          { label: 'Semester 1', value: '1' },
          { label: 'Semester 2', value: '2' },
          { label: 'Semester 3', value: '3' },
          { label: 'Semester 4', value: '4' },
          { label: 'Semester 5', value: '5' },
          { label: 'Semester 6', value: '6' },
          { label: 'Semester 7', value: '7' },
          { label: 'Semester 8', value: '8' },
          
        ])
          
      }else if(course==='diploma'|| course==='diplomac'){
          return([
          { label: 'Diploma Semester1', value: '1' },
          { label: 'Diploma Semester 2', value: '2' },
          { label: 'Diploma Semester 3', value: '3' },
          { label: 'Diploma Semester 4', value: '4' },
          { label: 'Diploma Semester 5', value: '5' },
          { label: 'Diploma Semester 6', value: '6' },
          { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
          { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
        ])
      }
    }else{
        return([{ label: '-- Choose --', value: '' }])

    }
  
}

export default SemesterByCourse