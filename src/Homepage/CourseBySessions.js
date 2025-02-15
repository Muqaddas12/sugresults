const CourseBySession=(session)=>{
    if(session==='201819'||session==='201920'|| session==='202021'){
        return([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS', value: 'otherc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS', value: 'diplomac' },
   
        ])
       
      }else if(session==='202122'||session==='202223'){
        
        return([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS', value: 'otherc' },
          { label: 'B.PHARMA CARRY RESULTS(ODD)', value: 'bpodd' },
          { label: 'B.PHARMA CARRY RESULTS(EVEN))', value: 'bpeven' },
          { label: 'B.PHARMA SPECIAL CARRY OVER RESULTS', value: 'bpspc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS', value: 'diplomac' },
   
        ])
    
      }else if(session==='202324'){
        
        return([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS(ODD)', value: 'otheroddc' },
          { label: 'UG & PG CARRY RESULTS(EVEN))', value: 'otherevenc' },
          { label: 'UG & PG CARRY RESULTS SPECIAL CARRY OVER RESULTS', value: 'otherspc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS(ODD)', value: 'diplomaoddc' },
          { label: 'DIPLOMA COURSES CARRY RESULTS(EVEN)', value: 'diplomaevenc' },
          { label: 'DIPLOMA COURSES SPECIAL CARRY OVER RESULTS', value: 'diplomaspc' },
   
        ])
      
      }
      else {
      
        return([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS(ODD)', value: 'otheroddc' },
          { label: 'UG & PG CARRY RESULTS(EVEN))', value: 'otherevenc' },
          { label: 'UG & PG CARRY RESULTS SPECIAL CARRY OVER RESULTS', value: 'otherspc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS(ODD)', value: 'diplomaoddc' },
          { label: 'DIPLOMA COURSES CARRY RESULTS(EVEN)', value: 'diplomaevenc' },
          { label: 'DIPLOMA COURSES SPECIAL CARRY OVER RESULTS', value: 'diplomaspc' },
   
        ])
      }
    
}
export default CourseBySession