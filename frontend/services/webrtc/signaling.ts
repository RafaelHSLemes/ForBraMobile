// Função de envio de oferta/resposta via sinalização (WebSocket, Firebase, etc.)
export const sendSignalingData = (data: any) => {
    // Aqui você implementa o envio de dados para o peer remoto (ex: WebSocket)
  };
  
  // Função para receber oferta/resposta via sinalização
  export const receiveSignalingData = (onReceive: (data: any) => void) => {
    // Aqui você implementa a recepção de dados vindos do peer remoto
    // e chama a função de callback passada
  };  