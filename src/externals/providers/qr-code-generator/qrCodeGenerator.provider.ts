import { HttpService } from "@nestjs/axios";


export default class QRCodeGeneratorProvider {
   private readonly qrCodeGeneratorUrl: string = "https://api.qr-code-generator.com/v1/create";
   private readonly accessToken = `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
    

   constructor(private readonly httpService: HttpService){} 
    
    async createOrder(text: string){
      const headers = { "Content-Type": "image/svg+xml"};
      const request = {
        "frame_name": "no-frame",
        "qr_data_text": text,
        "image_format": "SVG",
        "frame_color": "#02bfff",
        "frame_icon_name": "mobile",
        "frame_text": "Pague já",
        "background_color": "#ffffff",
        "foreground_color": "#2d7cda",
        "marker_right_inner_color": "#2d7cda",
        "marker_right_outer_color": "#00bfff",
        "marker_left_inner_color": "#2d7cda",
        "marker_left_outer_color": "#00bfff",
        "marker_bottom_inner_color": "#2d7cda",
        "marker_bottom_outer_color": "#00bfff",
        "marker_left_template": "version2",
        "marker_right_template": "version8",
        "marker_bottom_template": "version11"
    }

    const requestsla = await this.httpService.axiosRef
    .post(this.qrCodeGeneratorUrl, 
        request, {params: {'access-token': "H0Lf4M3YX0BHeePJQUh1j6tYSFTzKKTmKpJ7G8rS0RGu27VzzeT4N3FeTW5dTaYp"}})
      return (requestsla).data;
   }
}