import axios from 'axios'

export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('hkzf-city'))
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const curCity = new window.BMap.LocalCity()
      curCity.get(async res => {
       try {
         // console.log("当前城市信息：", res);
         const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
        //  console.log(result);
         localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
         resolve(result.data.body)
       } catch (e) {
        reject(e)
       }
      })
    })
  }

  return Promise.resolve(localCity)
}