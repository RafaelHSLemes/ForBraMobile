import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  postBar: { // Adiciona o estilo da barra de postagem
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  mediaButtons: { // Adiciona o estilo para os botões de mídia
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  postContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: { // Adiciona o estilo para o cabeçalho do post
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: { // Adiciona o estilo para a imagem de perfil
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: { // Adiciona o estilo para o nome do usuário
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default styles;